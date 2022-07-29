// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Interactable.h"
#include "Oven.generated.h"

class CPizza;
UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class SALAMISAM_API UOven : public UInteractable
{
	GENERATED_BODY()

public:	
	// Sets default values for this component's properties
	UOven();

protected:
	// Called when the game starts
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

	virtual void OnView() override;

	virtual void OnInteract() override;

private:
	void StorePizza(CPizza* Pizza);
	CPizza* StoredPizza;
};
