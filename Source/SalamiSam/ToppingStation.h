// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Interactable.h"
#include "ToppingStation.generated.h"


class CPizza;

UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class SALAMISAM_API UToppingStation : public UInteractable
{
	GENERATED_BODY()

public:	
	// Sets default values for this component's properties
	UToppingStation();

	void AddToppingsToPizza(CPizza* Pizza);

protected:
	// Called when the game starts
	virtual void BeginPlay() override;

public:	

	virtual void OnView() override;

	virtual void OnInteract() override;
private:
	FString GetToppingToAdd();
};
