// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Interactable.h"
#include "PizzaRetreiver.generated.h"


UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class SALAMISAM_API UPizzaRetreiver : public UInteractable
{
	GENERATED_BODY()

public:	
	// Sets default values for this component's properties
	UPizzaRetreiver();

protected:
	// Called when the game starts
	virtual void BeginPlay() override;

public:	
	// Called every frame

	virtual void OnView() override;

	virtual void OnInteract() override;
};
